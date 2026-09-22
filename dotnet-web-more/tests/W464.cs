using static DotnetWeb.W464;
namespace DotnetWeb;
public static class TestsW464{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v4+json; charset=utf-8"));Check.Json(c,"version",4);Check.Status(200,Select("APPLICATION/VND.CATALOG.V4+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v5+json"));Check.Status(406,Select("application/vnd.catalog.v4+xml"));
}
}}
