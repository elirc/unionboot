using static DotnetWeb.W495;
namespace DotnetWeb;
public static class TestsW495{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("application/octet-stream",Map("/assets/file.asset"));Check.Equal("application/octet-stream",Map("/assets/FILE.ASSET"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
