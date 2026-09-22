using static DotnetWeb.W467;
namespace DotnetWeb;
public static class TestsW467{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v7+json; charset=utf-8"));Check.Json(c,"version",7);Check.Status(200,Select("APPLICATION/VND.CATALOG.V7+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v8+json"));Check.Status(406,Select("application/vnd.catalog.v7+xml"));
}
}}
