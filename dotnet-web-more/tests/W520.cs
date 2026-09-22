using static DotnetWeb.W520;
namespace DotnetWeb;
public static class TestsW520{public static async Task Run(){await Task.CompletedTask;
{
var files=new FormFileCollection();for(int i=0;i<1;i++)files.Add(Check.File(new string('x',40)));var c=await Check.Execute(Gate(files));Check.Json(c,"count",1);Check.Json(c,"total",40);
}
{
Check.Status(400,Gate(new FormFileCollection()));Check.Status(413,Gate(new FormFileCollection{Check.File(new string('x',41))}));var tooMany=new FormFileCollection();for(int i=0;i<2;i++)tooMany.Add(Check.File("x"));Check.Status(413,Gate(tooMany));Check.Status(200,Gate(new FormFileCollection{Check.File("")}));
}
}}
