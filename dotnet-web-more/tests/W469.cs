using static DotnetWeb.W469;
namespace DotnetWeb;
public static class TestsW469{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v9+json; charset=utf-8"));Check.Json(c,"version",9);Check.Status(200,Select("APPLICATION/VND.CATALOG.V9+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v10+json"));Check.Status(406,Select("application/vnd.catalog.v9+xml"));
}
}}
