using static DotnetWeb.W574;
namespace DotnetWeb;
public static class TestsW574{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",400));Check.Equal("gzip",EncodingFor("gzip","text/plain",401));Check.True(EncodingFor("br","text/plain",399) is null);Check.True(EncodingFor("br","image/png",500) is null);
}
{
Check.True(EncodingFor(null,"text/plain",400) is null);Check.True(EncodingFor("identity","text/plain",400) is null);Check.True(EncodingFor("gzip;q=0","text/plain",400) is null);
}
}}
