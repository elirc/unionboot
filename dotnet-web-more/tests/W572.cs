using static DotnetWeb.W572;
namespace DotnetWeb;
public static class TestsW572{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal("br",EncodingFor("gzip, br","application/json",200));Check.Equal("gzip",EncodingFor("gzip","text/plain",201));Check.True(EncodingFor("br","text/plain",199) is null);Check.True(EncodingFor("br","image/png",300) is null);
}
{
Check.True(EncodingFor(null,"text/plain",200) is null);Check.True(EncodingFor("identity","text/plain",200) is null);Check.True(EncodingFor("gzip;q=0","text/plain",200) is null);
}
}}
