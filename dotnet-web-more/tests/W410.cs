using static DotnetWeb.W410;
namespace DotnetWeb;
public static class TestsW410{public static async Task Run(){await Task.CompletedTask;
{
var store=new Store{Revision=12,Value="old"};var c=Check.Context();c.Request.Headers["If-Match"]="\"12\"";Check.Status(204,Update(c,store,"new"));Check.Equal(13,store.Revision);Check.Equal("new",store.Value);Check.Equal("\"13\"",c.Response.Headers["ETag"].ToString());Check.Status(412,Update(c,store,"again"));Check.Equal("new",store.Value);
}
{
var store=new Store{Revision=12,Value="old"};var c=Check.Context();Check.Status(428,Update(c,store,"new"));c.Request.Headers["If-Match"]="W/\"12\"";Check.Status(412,Update(c,store,"new"));Check.Equal(12,store.Revision);c.Request.Headers["If-Match"]="*";Check.Status(204,Update(c,store,"new"));
}
}}
