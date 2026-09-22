using static DotnetWeb.W409;
namespace DotnetWeb;
public static class TestsW409{public static async Task Run(){await Task.CompletedTask;
{
var store=new Store{Revision=11,Value="old"};var c=Check.Context();c.Request.Headers["If-Match"]="\"11\"";Check.Status(204,Update(c,store,"new"));Check.Equal(12,store.Revision);Check.Equal("new",store.Value);Check.Equal("\"12\"",c.Response.Headers["ETag"].ToString());Check.Status(412,Update(c,store,"again"));Check.Equal("new",store.Value);
}
{
var store=new Store{Revision=11,Value="old"};var c=Check.Context();Check.Status(428,Update(c,store,"new"));c.Request.Headers["If-Match"]="W/\"11\"";Check.Status(412,Update(c,store,"new"));Check.Equal(11,store.Revision);c.Request.Headers["If-Match"]="*";Check.Status(204,Update(c,store,"new"));
}
}}
