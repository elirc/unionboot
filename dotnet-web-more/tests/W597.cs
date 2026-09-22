using static DotnetWeb.W597;
namespace DotnetWeb;
public static class TestsW597{public static async Task Run(){await Task.CompletedTask;
{
var state=new Dictionary<string,string>{["comment"]="old",["untouched"]="keep"};using var patch=JsonDocument.Parse("{\"comment\":\"new\"}");Check.Status(200,Merge(state,patch.RootElement));var once=JsonSerializer.Serialize(state);Check.Status(200,Merge(state,patch.RootElement));Check.Equal(once,JsonSerializer.Serialize(state));Check.Equal("new",state["comment"]);Check.Equal("keep",state["untouched"]);using var remove=JsonDocument.Parse("{\"comment\":null}");Merge(state,remove.RootElement);Merge(state,remove.RootElement);Check.True(!state.ContainsKey("comment"));
}
{
var state=new Dictionary<string,string>{["comment"]="old"};using var bad=JsonDocument.Parse("{\"comment\":\"new\",\"unknown\":1}");Check.Status(400,Merge(state,bad.RootElement));Check.Equal("old",state["comment"]);using var invalid=JsonDocument.Parse("{\"comment\":7}");Check.Status(400,Merge(state,invalid.RootElement));using var empty=JsonDocument.Parse("{}");Merge(state,empty.RootElement);Check.Equal("old",state["comment"]);
}
}}
