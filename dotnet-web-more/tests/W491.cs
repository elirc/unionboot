using static DotnetWeb.W491;
namespace DotnetWeb;
public static class TestsW491{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("application/json",Map("/assets/file.data"));Check.Equal("application/json",Map("/assets/FILE.DATA"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
