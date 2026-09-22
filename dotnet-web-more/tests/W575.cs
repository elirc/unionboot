using static DotnetWeb.W575;
namespace DotnetWeb;
public static class TestsW575{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",500));Check.Equal("gzip",EncodingFor("gzip","text/plain",501));Check.True(EncodingFor("br","text/plain",499) is null);Check.True(EncodingFor("br","image/png",600) is null);
}
{
Check.True(EncodingFor(null,"text/plain",500) is null);Check.True(EncodingFor("identity","text/plain",500) is null);Check.True(EncodingFor("gzip;q=0","text/plain",500) is null);
}
}}
