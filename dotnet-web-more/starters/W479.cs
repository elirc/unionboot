// W479: Sparse fieldset projection / Default fields id and title and price
namespace DotnetWeb;
public static class W479{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W479");}
}
