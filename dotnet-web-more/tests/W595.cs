using static DotnetWeb.W595;
namespace DotnetWeb;
public static class TestsW595{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["caption"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"caption\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["caption"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"caption\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("caption"));
}
{
var state=new Dictionary<string,string>{["caption"]="old"};using var bad=JsonDocument.Parse("{\"caption\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["caption"]);using var invalid=JsonDocument.Parse("{\"caption\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["caption"]);
}
}}
