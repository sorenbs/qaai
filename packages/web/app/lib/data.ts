export function getAllTests() {
    return [ // todo: load these from db
        {
          id: 0,
          desciption: "Cookie Banner should disappear after click",
          date: "09:34 AM",
          instruction:
            "Go to http://soraclee.com. Verify that there is a cookie banner. Then, click the accept button. Then verify that the banner is gone.",
        }
      ]
}

export function getTestById(testId: number) {
    return getAllTests()[0]
}

export function getRunsByTestId(testId: number) {
    return [
        { id: 0, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 1, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 2, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 3, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 4, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 5, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 6, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 7, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 8, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 9, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 10, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
        { id: 11, testId: 0, date: "Today", status: "✅ Success", duration: "1:22" },
      ]
}

export function getRunEventsByRunId(runId: number) {
    return [
        {
            title: "Run started",
            description: "Go to http://soraclee.com. Verify that there is a cookie banner. Then, click the accept button. Then verify that the banner is gone.",
            time: "0:00",
        },
        {
            title: "Open website",
            description: "Opened the website http://soraclee.com",
            time: "0:10",
        },
        {
            title: "Analyze website",
            description: "Q: Is there a cookie banner on the page? /n A: Yes, there is a cookie banner on the page.",
            time: "0:13",
        },
        {
            title: "Identify element",
            description: "Element: Accept cookies. /n Coordinates: (956.8, 650.52)",
            time: "0:16",
        },
        {
            title: "Click element",
            description: "Clicked the mouse at (956.8, 650.52)",
            time: "0:17",
        },
        {
            title: "Analyze website",
            description: "Q: Is there a cookie banner on the page? /n A: No, there is no cookie banner on the page.",
            time: "0:18",
        },
        {
            title: "Run completed",
            description: "Status: ✅ Success",
            time: "o:21",
        },
        
    ]
}