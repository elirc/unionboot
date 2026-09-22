using static DotnetWeb.W404;
namespace DotnetWeb;
public static class TestsW404{public static async Task Run(){await Task.CompletedTask;
{
var store=new Store{Revision=6,Value="old"};var c=Check.Context();c.Request.Headers["If-Match"]="\"6\"";Check.Status(204,Update(c,store,"new"));Check.Equal(7,store.Revision);Check.Equal("new",store.Value);Check.Equal("\"7\"",c.Response.Headers["ETag"].ToString());Check.Status(412,Update(c,store,"again"));Check.Equal("new",store.Value);
}
{
var store=new Store{Revision=6,Value="old"};var c=Check.Context();Check.Status(428,Update(c,store,"new"));c.Request.Headers["If-Match"]="W/\"6\"";Check.Status(412,Update(c,store,"new"));Check.Equal(6,store.Revision);c.Request.Headers["If-Match"]="*";Check.Status(204,Update(c,store,"new"));
}
}}
