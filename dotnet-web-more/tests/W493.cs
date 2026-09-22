using static DotnetWeb.W493;
namespace DotnetWeb;
public static class TestsW493{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("text/csv",Map("/assets/file.report"));Check.Equal("text/csv",Map("/assets/FILE.REPORT"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
