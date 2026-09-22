using static DotnetWeb.W583;
namespace DotnetWeb;
public static class TestsW583{public static async Task Run(){await Task.CompletedTask;
{
var fields=Enumerable.Range(0,3).Select(i=>("f"+i,"value")).ToList();fields.Add(("f0","second"));var c=Check.MultipartRequest(fields.ToArray(),new[]{("upload","a.txt","abc"),("upload","b.txt","é")});var result=await Check.Execute(await Count(c));Check.Json(result,"keys",3);Check.Json(result,"values",4);Check.Json(result,"files",2);Check.Json(result,"bytes",5);
}
{
var c=Check.MultipartRequest(new[]{("only","text")},Array.Empty<(string,string,string)>());var result=await Check.Execute(await Count(c));Check.Json(result,"keys",1);Check.Json(result,"files",0);Check.Json(result,"bytes",0);
}
}}
