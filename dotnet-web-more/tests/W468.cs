using static DotnetWeb.W468;
namespace DotnetWeb;
public static class TestsW468{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v8+json; charset=utf-8"));Check.Json(c,"version",8);Check.Status(200,Select("APPLICATION/VND.CATALOG.V8+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v9+json"));Check.Status(406,Select("application/vnd.catalog.v8+xml"));
}
}}
