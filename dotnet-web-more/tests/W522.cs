using static DotnetWeb.W522;
namespace DotnetWeb;
public static class TestsW522{public static async Task Run(){await Task.CompletedTask;
{
var input=new HeaderDictionary{["x-correlation-id"]=new StringValues(new[]{"a","b"}),["baggage"]="task=7",["Authorization"]="secret",["Cookie"]="session=secret",["Connection"]="keep-alive"};var output=Propagate(input);Check.Equal(2,output.Count);Check.Equal(new[]{"a","b"},output["X-Correlation-Id"].ToArray());Check.Equal("task=7",output["baggage"].ToString());Check.True(!output.ContainsKey("Authorization"));Check.Equal(5,input.Count);output["X-Correlation-Id"]="changed";Check.Equal("a,b",input["X-Correlation-Id"].ToString());
}
{
Check.Equal(0,Propagate(new HeaderDictionary{["Unlisted"]="x"}).Count);
}
}}
