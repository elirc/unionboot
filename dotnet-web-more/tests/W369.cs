using static DotnetWeb.W369;
namespace DotnetWeb;
public static class TestsW369{public static async Task Run(){await Task.CompletedTask;
{
var c=Create();Check.True(c.Match(null,null,"id",new RouteValueDictionary {["id"]=10},RouteDirection.IncomingRequest));Check.True(c.Match(null,null,"id",new RouteValueDictionary {["id"]="1"},RouteDirection.IncomingRequest));Check.True(!c.Match(null,null,"id",new RouteValueDictionary {["id"]=11},RouteDirection.IncomingRequest));Check.True(!c.Match(null,null,"id",new RouteValueDictionary {["id"]="0"},RouteDirection.IncomingRequest));
}
{
Check.True(!Create().Match(null,null,"id",new RouteValueDictionary {["id"]="abc"},RouteDirection.IncomingRequest));Check.True(!Create().Match(null,null,"id",new RouteValueDictionary(),RouteDirection.IncomingRequest));Check.True(!Create().Match(null,null,"id",new RouteValueDictionary {["id"]="1.5"},RouteDirection.IncomingRequest));
}
}}
