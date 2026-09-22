using static DotnetWeb.W592;
namespace DotnetWeb;
public static class TestsW592{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["note"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"note\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["note"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"note\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("note"));
}
{
var state=new Dictionary<string,string>{["note"]="old"};using var bad=JsonDocument.Parse("{\"note\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["note"]);using var invalid=JsonDocument.Parse("{\"note\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["note"]);
}
}}
