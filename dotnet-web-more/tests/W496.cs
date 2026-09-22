using static DotnetWeb.W496;
namespace DotnetWeb;
public static class TestsW496{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("application/xml",Map("/assets/file.feedx"));Check.Equal("application/xml",Map("/assets/FILE.FEEDX"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
