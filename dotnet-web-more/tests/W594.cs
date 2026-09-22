using static DotnetWeb.W594;
namespace DotnetWeb;
public static class TestsW594{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["label"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"label\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["label"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"label\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("label"));
}
{
var state=new Dictionary<string,string>{["label"]="old"};using var bad=JsonDocument.Parse("{\"label\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["label"]);using var invalid=JsonDocument.Parse("{\"label\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["label"]);
}
}}
