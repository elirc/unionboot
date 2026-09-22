using static DotnetWeb.W470;
namespace DotnetWeb;
public static class TestsW470{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v10+json; charset=utf-8"));Check.Json(c,"version",10);Check.Status(200,Select("APPLICATION/VND.CATALOG.V10+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v11+json"));Check.Status(406,Select("application/vnd.catalog.v10+xml"));
}
}}
