using static DotnetWeb.W518;
namespace DotnetWeb;
public static class TestsW518{public static async Task Run(){await Task.CompletedTask;
{
var files=new FormFileCollection();for(int i=0;i<2;i++)files.Add(Check.File(new string('x',32)));var c=await Check.Execute(Gate(files));Check.Json(c,"count",2);Check.Json(c,"total",64);
}
{
Check.Status(400,Gate(new FormFileCollection()));Check.Status(413,Gate(new FormFileCollection{Check.File(new string('x',33))}));var tooMany=new FormFileCollection();for(int i=0;i<3;i++)tooMany.Add(Check.File("x"));Check.Status(413,Gate(tooMany));Check.Status(200,Gate(new FormFileCollection{Check.File("")}));
}
}}
