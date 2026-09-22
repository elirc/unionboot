using static DotnetWeb.W577;
namespace DotnetWeb;
public static class TestsW577{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",700));Check.Equal("gzip",EncodingFor("gzip","text/plain",701));Check.True(EncodingFor("br","text/plain",699) is null);Check.True(EncodingFor("br","image/png",800) is null);
}
{
Check.True(EncodingFor(null,"text/plain",700) is null);Check.True(EncodingFor("identity","text/plain",700) is null);Check.True(EncodingFor("gzip;q=0","text/plain",700) is null);
}
}}
