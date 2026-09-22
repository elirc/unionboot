using static DotnetWeb.W528;
namespace DotnetWeb;
public static class TestsW528{public static async Task Run(){await Task.CompletedTask;
{
var input=new HeaderDictionary{["x-request-id"]=new StringValues(new[]{"a","b"}),["baggage"]="task=7",["Authorization"]="secret",["Cookie"]="session=secret",["Connection"]="keep-alive"};var output=Propagate(input);Check.Equal(2,output.Count);Check.Equal(new[]{"a","b"},output["X-Request-Id"].ToArray());Check.Equal("task=7",output["baggage"].ToString());Check.True(!output.ContainsKey("Authorization"));Check.Equal(5,input.Count);output["X-Request-Id"]="changed";Check.Equal("a,b",input["X-Request-Id"].ToString());
}
{
Check.Equal(0,Propagate(new HeaderDictionary{["Unlisted"]="x"}).Count);
}
}}
