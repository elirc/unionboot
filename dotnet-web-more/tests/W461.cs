using static DotnetWeb.W461;
namespace DotnetWeb;
public static class TestsW461{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v1+json; charset=utf-8"));Check.Json(c,"version",1);Check.Status(200,Select("APPLICATION/VND.CATALOG.V1+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v2+json"));Check.Status(406,Select("application/vnd.catalog.v1+xml"));
}
}}
