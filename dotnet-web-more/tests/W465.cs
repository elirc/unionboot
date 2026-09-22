using static DotnetWeb.W465;
namespace DotnetWeb;
public static class TestsW465{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v5+json; charset=utf-8"));Check.Json(c,"version",5);Check.Status(200,Select("APPLICATION/VND.CATALOG.V5+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v6+json"));Check.Status(406,Select("application/vnd.catalog.v5+xml"));
}
}}
