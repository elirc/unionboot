// W475: Sparse fieldset projection / Default fields id and title
namespace DotnetWeb;
public static class W475{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W475");}
}
