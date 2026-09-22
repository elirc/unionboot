using static DotnetWeb.W576;
namespace DotnetWeb;
public static class TestsW576{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",600));Check.Equal("gzip",EncodingFor("gzip","text/plain",601));Check.True(EncodingFor("br","text/plain",599) is null);Check.True(EncodingFor("br","image/png",700) is null);
}
{
Check.True(EncodingFor(null,"text/plain",600) is null);Check.True(EncodingFor("identity","text/plain",600) is null);Check.True(EncodingFor("gzip;q=0","text/plain",600) is null);
}
}}
