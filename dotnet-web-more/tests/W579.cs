using static DotnetWeb.W579;
namespace DotnetWeb;
public static class TestsW579{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",900));Check.Equal("gzip",EncodingFor("gzip","text/plain",901));Check.True(EncodingFor("br","text/plain",899) is null);Check.True(EncodingFor("br","image/png",1000) is null);
}
{
Check.True(EncodingFor(null,"text/plain",900) is null);Check.True(EncodingFor("identity","text/plain",900) is null);Check.True(EncodingFor("gzip;q=0","text/plain",900) is null);
}
}}
