// W476: Sparse fieldset projection / Default fields id and price
namespace DotnetWeb;
public static class W476{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W476");}
}
