using static DotnetWeb.W580;
namespace DotnetWeb;
public static class TestsW580{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",1000));Check.Equal("gzip",EncodingFor("gzip","text/plain",1001));Check.True(EncodingFor("br","text/plain",999) is null);Check.True(EncodingFor("br","image/png",1100) is null);
}
{
Check.True(EncodingFor(null,"text/plain",1000) is null);Check.True(EncodingFor("identity","text/plain",1000) is null);Check.True(EncodingFor("gzip;q=0","text/plain",1000) is null);
}
}}
