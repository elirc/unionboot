using static DotnetWeb.W591;
namespace DotnetWeb;
public static class TestsW591{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["title"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"title\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["title"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"title\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("title"));
}
{
var state=new Dictionary<string,string>{["title"]="old"};using var bad=JsonDocument.Parse("{\"title\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["title"]);using var invalid=JsonDocument.Parse("{\"title\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["title"]);
}
}}
