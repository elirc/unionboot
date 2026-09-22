using static DotnetWeb.W529;
namespace DotnetWeb;
public static class TestsW529{public static async Task Run(){await Task.CompletedTask;
{
var input=new HeaderDictionary{["x-source"]=new StringValues(new[]{"a","b"}),["baggage"]="task=7",["Authorization"]="secret",["Cookie"]="session=secret",["Connection"]="keep-alive"};var output=Propagate(input);Check.Equal(2,output.Count);Check.Equal(new[]{"a","b"},output["X-Source"].ToArray());Check.Equal("task=7",output["baggage"].ToString());Check.True(!output.ContainsKey("Authorization"));Check.Equal(5,input.Count);output["X-Source"]="changed";Check.Equal("a,b",input["X-Source"].ToString());
}
{
Check.Equal(0,Propagate(new HeaderDictionary{["Unlisted"]="x"}).Count);
}
}}
