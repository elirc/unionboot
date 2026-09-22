using static DotnetWeb.W573;
namespace DotnetWeb;
public static class TestsW573{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",300));Check.Equal("gzip",EncodingFor("gzip","text/plain",301));Check.True(EncodingFor("br","text/plain",299) is null);Check.True(EncodingFor("br","image/png",400) is null);
}
{
Check.True(EncodingFor(null,"text/plain",300) is null);Check.True(EncodingFor("identity","text/plain",300) is null);Check.True(EncodingFor("gzip;q=0","text/plain",300) is null);
}
}}
