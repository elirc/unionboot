using static DotnetWeb.W500;
namespace DotnetWeb;
public static class TestsW500{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("application/pdf",Map("/assets/file.docx2"));Check.Equal("application/pdf",Map("/assets/FILE.DOCX2"));Check.Equal("text/css",Map("site.css"));Check.Equal("image/png",Map("image.png"));
}
{
Check.Equal("application/octet-stream",Map("file.unknown-extension"));Check.Equal("application/octet-stream",Map("no-extension"));Check.Equal("text/plain",Map("readme.txt"));
}
}}
