import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { BrowserWindow } from './BrowserWindow';
import { exit } from 'process';

type BaseStep = {
    time: number;
}

type WorkflowDefinitionStep = BaseStep & {
    type: "workflow_definition";
    workflowDescription: string;
}

type ToolReponseStep = BaseStep & {
    type: "tool_response";
    toolName: string;
    toolArguments: Record<string, unknown>;
    toolResponse: string;
}

type ScreenshotStep = BaseStep & {
    type: "screenshot";
    screenshot: Buffer;
}

type ElementBoundingBoxStep = BaseStep & {
    type: "element_bounding_box";
    boundingBox: [number, number, number, number];
}

type ClickMouseStep = BaseStep & {
    type: "click_mouse";
    x: number;
    y: number;
}

type FinalVideoStep = BaseStep & {
    type: "final_video";
    videoPath: string;
}

type FinalResultStep = {
    type: "final_result";
    result: "SUCCESS" | "FAIL";
}

type Step =
    | WorkflowDefinitionStep
    | ToolReponseStep
    | ScreenshotStep
    | ElementBoundingBoxStep
    | ClickMouseStep
    | FinalVideoStep
    | FinalResultStep;

export class WorkflowRunner {
    private BrowserWindow: BrowserWindow;
    workflowDescription: string;
    startTime: number;
    private queue: Step[] = [];

    constructor(workflowDescription: string) {
        this.BrowserWindow = new BrowserWindow();
        this.workflowDescription = workflowDescription;
        this.startTime = Date.now();
    }

    recordStep(step: Step) {
        this.queue.push(step);
        this._resolve?.();
        this._waitForData = new Promise<void>(r => this._resolve = r);
    }
    private _resolve: (() => void) | null = null;
    private _waitForData = new Promise<void>(r => this._resolve = r);

    async * observeWorkflowRun(): AsyncGenerator<Step, FinalResultStep, unknown> {

        while (true) {
            // If queue is empty, wait for data
            if (this.queue.length === 0) {
                await this._waitForData;
            }

            // Yield the next value or return if it's a final result
            const nextValue = this.queue.shift()!;

            if (nextValue.type === "final_result") {
                return nextValue
            }

            yield nextValue
        }
    }

    async runWorkflow(): Promise<FinalResultStep> {
        const currentTime = () => Date.now() - this.startTime;

        this.recordStep({ type: "workflow_definition", workflowDescription: this.workflowDescription, time: 0 });

        const google = createGoogleGenerativeAI({ apiKey: process.env['GEMINI_KEY'] });
        const model = google('gemini-2.0-flash-exp', { structuredOutputs: true })

        const { text } = await generateText({
            model,
            tools: {
                go_to_website: tool({
                    description:
                        'Start a browser and go to the specified website url',
                    parameters: z.object({ url: z.string().nonempty() }),
                    execute: async ({ url }) => {
                        await this.BrowserWindow.openUrl(url);

                        const toolResponse = `Opened the website ${url}`

                        this.recordStep({
                            type: "tool_response",
                            toolName: "go_to_website",
                            toolArguments: { url },
                            toolResponse,
                            time: currentTime()
                        })
                        return toolResponse
                    },
                }),
                analyze_website_screenshot: tool({
                    description:
                        'Take a screenshot of the currently open website and analyze it based on the question provided.',
                    parameters: z.object({ question: z.string().nonempty() }),
                    execute: async ({ question }) => {
                        const screenshot = await this.BrowserWindow.takeScreenshot();


                        const result = await generateText({
                            model,
                            messages: [
                                {
                                    role: 'user',
                                    content: [
                                        { type: 'text', text: question },
                                        {
                                            type: 'image',
                                            image: screenshot,
                                        },
                                    ],
                                },
                            ],
                            system: 'You are an AI that can analyze a screenshot of a website and answer questions about it. Answer the users question concisely.',
                        });

                        const toolResponse = result.text

                        this.recordStep({
                            type: "tool_response",
                            toolName: "analyze_website_screenshot",
                            toolArguments: { question },
                            toolResponse,
                            time: currentTime()
                        })
                        this.recordStep({
                            type: "screenshot",
                            screenshot: screenshot,
                            time: currentTime()
                        })

                        return toolResponse
                    },
                }),
                get_coordinate_for_screen_element: tool({
                    description:
                        'Find the described element on the page and return the center coordinate relative to the browser viewport, such that the user can click it. User the format (x, y)',
                    parameters: z.object({ description: z.string().nonempty() }),
                    execute: async ({ description }) => {

                        const screenshot = await this.BrowserWindow.takeScreenshot();

                        const result = await generateText({
                            model,
                            messages: [
                                {
                                    role: 'user',
                                    content: [
                                        { type: 'text', text: `Return a bounding box for the ${description}. \n [ymin, xmin, ymax, xmax]` },
                                        {
                                            type: 'image',
                                            image: screenshot,
                                        },
                                    ],
                                },
                            ],
                            system: 'You are an AI that can analyze a screenshot of a website and return the bounding box of the element described by the user.',
                        });

                        const boundingBox = JSON.parse(`[${result.text.split('[')[1].split(']')[0]}]`)

                        // window size: 1280 x 720
                        const xmin = (boundingBox[1] / 1000) * 1280
                        const xmax = (boundingBox[3] / 1000) * 1280
                        const ymin = (boundingBox[0] / 1000) * 720
                        const ymax = (boundingBox[2] / 1000) * 720

                        const x = xmin + (xmax - xmin) / 2
                        const y = ymin + (ymax - ymin) / 2

                        const toolResponse = `(${x}, ${y})`

                        this.recordStep({
                            type: "tool_response",
                            toolName: "get_coordinate_for_screen_element",
                            toolArguments: { description },
                            toolResponse,
                            time: currentTime()
                        })
                        this.recordStep({
                            type: "screenshot",
                            screenshot: screenshot,
                            time: currentTime()
                        })
                        this.recordStep({
                            type: "element_bounding_box",
                            boundingBox,
                            time: currentTime()
                        })

                        return toolResponse
                    },
                }),
                click_mouse: tool({
                    description:
                        'Click the mouse at the specified coordinate on the screen',
                    parameters: z.object({ x: z.number(), y: z.number() }),
                    execute: async ({ x, y }) => {

                        await this.BrowserWindow.mouseClick(x, y)
                        const toolResponse = `Clicked the mouse at (${x}, ${y})`

                        this.recordStep({
                            type: "tool_response",
                            toolName: "get_coordinate_for_screen_element",
                            toolArguments: { x, y },
                            toolResponse,
                            time: currentTime()
                        })
                        this.recordStep({
                            type: "click_mouse",
                            x,
                            y,
                            time: currentTime()
                        })

                        return
                    },
                }),
            },
            maxSteps: 10,
            system:
                "You are an agentic LLM performing Website QA tasks by reading the workflow provided by the user, executing it using the tools you have available. If the workflow is not able to complete you will reply with FAIL. If the workflow completes, you will reply with SUCCESS.",
            prompt:
                "Go to http://soraclee.com. Verify that there is a cookie banner. Then, click the accept button. Then verify that the banner is gone.",
        });

        const videoPath = await this.BrowserWindow.getVideoPath()
        if (videoPath) {
            this.recordStep({ type: "final_video", videoPath, time: currentTime() })
        }

        await this.BrowserWindow.stop()

        if (text.indexOf("FAIL") > -1) {
            this.recordStep({ type: "final_result", result: "FAIL" })
            return { type: "final_result", result: "FAIL" }
        }

        if (text.indexOf("SUCCESS") > -1) {
            this.recordStep({ type: "final_result", result: "SUCCESS" })
            return { type: "final_result", result: "SUCCESS" }
        }

        console.log("Neither Success nor Fail found in LLM response")

        this.recordStep({ type: "final_result", result: "FAIL" })
        return { type: "final_result", result: "FAIL" }
    }
}

const runner = new WorkflowRunner("Go to http://soraclee.com. Verify that there is a cookie banner. Then, click the accept button. Then verify that the banner is gone.")

async function observe() {

    for await (const step of runner.observeWorkflowRun()) {
        console.log("Step")
        console.log(step)
    }
}


await Promise.all([
    observe(),
    runner.runWorkflow().then(console.log),
])

console.log("Done")

exit(0)
