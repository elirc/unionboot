using static DotnetWeb.W600;
namespace DotnetWeb;
public static class TestsW600{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["owner"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"owner\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["owner"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"owner\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("owner"));
}
{
var state=new Dictionary<string,string>{["owner"]="old"};using var bad=JsonDocument.Parse("{\"owner\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["owner"]);using var invalid=JsonDocument.Parse("{\"owner\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["owner"]);
}
}}
