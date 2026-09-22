// W474: Sparse fieldset projection / Default fields stock
namespace DotnetWeb;
public static class W474{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W474");}
}
