using static DotnetWeb.W526;
namespace DotnetWeb;
public static class TestsW526{public static async Task Run(){await Task.CompletedTask;
{
var input=new HeaderDictionary{["x-client-version"]=new StringValues(new[]{"a","b"}),["baggage"]="task=7",["Authorization"]="secret",["Cookie"]="session=secret",["Connection"]="keep-alive"};var output=Propagate(input);Check.Equal(2,output.Count);Check.Equal(new[]{"a","b"},output["X-Client-Version"].ToArray());Check.Equal("task=7",output["baggage"].ToString());Check.True(!output.ContainsKey("Authorization"));Check.Equal(5,input.Count);output["X-Client-Version"]="changed";Check.Equal("a,b",input["X-Client-Version"].ToString());
}
{
Check.Equal(0,Propagate(new HeaderDictionary{["Unlisted"]="x"}).Count);
}
}}
