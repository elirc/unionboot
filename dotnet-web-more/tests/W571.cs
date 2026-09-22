using static DotnetWeb.W571;
namespace DotnetWeb;
public static class TestsW571{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",100));Check.Equal("gzip",EncodingFor("gzip","text/plain",101));Check.True(EncodingFor("br","text/plain",99) is null);Check.True(EncodingFor("br","image/png",200) is null);
}
{
Check.True(EncodingFor(null,"text/plain",100) is null);Check.True(EncodingFor("identity","text/plain",100) is null);Check.True(EncodingFor("gzip;q=0","text/plain",100) is null);
}
}}
