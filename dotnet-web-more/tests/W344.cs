using static DotnetWeb.W344;
namespace DotnetWeb;
public static class TestsW344{public static async Task Run(){await Task.CompletedTask;
{
var c=await Check.Execute(await Handle(Check.File(new string('a',5))));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"size",5);Check.Json(c,"text",new string('a',5));
}
{
Check.Status(413,await Handle(Check.File(new string('a',6))));Check.Status(400,await Handle(null));Check.Status(400,await Handle(Check.File("")));var c=await Check.Execute(await Handle(Check.File("é")));Check.Json(c,"size",2);Check.Json(c,"text","é");
}
}}
