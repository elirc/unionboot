using static DotnetWeb.W463;
namespace DotnetWeb;
public static class TestsW463{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v3+json; charset=utf-8"));Check.Json(c,"version",3);Check.Status(200,Select("APPLICATION/VND.CATALOG.V3+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v4+json"));Check.Status(406,Select("application/vnd.catalog.v3+xml"));
}
}}
