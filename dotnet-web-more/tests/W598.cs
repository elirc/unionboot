using static DotnetWeb.W598;
namespace DotnetWeb;
public static class TestsW598{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["status"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"status\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["status"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"status\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("status"));
}
{
var state=new Dictionary<string,string>{["status"]="old"};using var bad=JsonDocument.Parse("{\"status\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["status"]);using var invalid=JsonDocument.Parse("{\"status\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["status"]);
}
}}
