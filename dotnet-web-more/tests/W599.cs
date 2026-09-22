using static DotnetWeb.W599;
namespace DotnetWeb;
public static class TestsW599{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["category"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"category\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["category"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"category\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("category"));
}
{
var state=new Dictionary<string,string>{["category"]="old"};using var bad=JsonDocument.Parse("{\"category\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["category"]);using var invalid=JsonDocument.Parse("{\"category\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["category"]);
}
}}
