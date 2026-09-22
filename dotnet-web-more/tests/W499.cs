using static DotnetWeb.W499;
namespace DotnetWeb;
public static class TestsW499{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("application/zip",Map("/assets/file.bundle"));Check.Equal("application/zip",Map("/assets/FILE.BUNDLE"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
