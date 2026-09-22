using static DotnetWeb.W492;
namespace DotnetWeb;
public static class TestsW492{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("text/plain",Map("/assets/file.note"));Check.Equal("text/plain",Map("/assets/FILE.NOTE"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
