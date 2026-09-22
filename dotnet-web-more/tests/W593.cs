using static DotnetWeb.W593;
namespace DotnetWeb;
public static class TestsW593{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["summary"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"summary\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["summary"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"summary\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("summary"));
}
{
var state=new Dictionary<string,string>{["summary"]="old"};using var bad=JsonDocument.Parse("{\"summary\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["summary"]);using var invalid=JsonDocument.Parse("{\"summary\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["summary"]);
}
}}
