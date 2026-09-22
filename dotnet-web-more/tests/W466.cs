using static DotnetWeb.W466;
namespace DotnetWeb;
public static class TestsW466{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(Select("text/plain, application/vnd.catalog.v6+json; charset=utf-8"));Check.Json(c,"version",6);Check.Status(200,Select("APPLICATION/VND.CATALOG.V6+JSON"));
}
{
Check.Status(406,Select(null));Check.Status(406,Select("application/json"));Check.Status(406,Select("application/vnd.catalog.v7+json"));Check.Status(406,Select("application/vnd.catalog.v6+xml"));
}
}}
