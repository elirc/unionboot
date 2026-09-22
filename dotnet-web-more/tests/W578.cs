using static DotnetWeb.W578;
namespace DotnetWeb;
public static class TestsW578{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",800));Check.Equal("gzip",EncodingFor("gzip","text/plain",801));Check.True(EncodingFor("br","text/plain",799) is null);Check.True(EncodingFor("br","image/png",900) is null);
}
{
Check.True(EncodingFor(null,"text/plain",800) is null);Check.True(EncodingFor("identity","text/plain",800) is null);Check.True(EncodingFor("gzip;q=0","text/plain",800) is null);
}
}}
