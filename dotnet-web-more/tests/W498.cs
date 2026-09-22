using static DotnetWeb.W498;
namespace DotnetWeb;
public static class TestsW498{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("image/png",Map("/assets/file.snap"));Check.Equal("image/png",Map("/assets/FILE.SNAP"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
